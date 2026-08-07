import sqlite3
from typing import List, Dict, Any, Optional
import json
import os
from config import settings

DB_FILE = "trust_graph.db"

class MySQLRow:
    def __init__(self, keys, values):
        self._keys = keys
        self._values = list(values)
        self._dict = dict(zip(keys, self._values))
        
    def __getitem__(self, key):
        if isinstance(key, int):
            return self._values[key]
        return self._dict[key]
        
    def __iter__(self):
        return iter(self._values)
        
    def __len__(self):
        return len(self._values)
        
    def get(self, key, default=None):
        return self._dict.get(key, default)

    def keys(self):
        return self._keys

    def values(self):
        return self._values

class MySQLCursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def execute(self, query, params=None):
        if params is not None:
            # Replace SQLite style ? with MySQL style %s
            query = query.replace('?', '%s')
            return self.cursor.execute(query, params)
        else:
            return self.cursor.execute(query)
            
    def executemany(self, query, params):
        query = query.replace('?', '%s')
        return self.cursor.executemany(query, params)
        
    def _wrap_row(self, row):
        if row is None:
            return None
        keys = [col[0] for col in self.cursor.description]
        return MySQLRow(keys, row)
        
    def fetchone(self):
        row = self.cursor.fetchone()
        return self._wrap_row(row)
        
    def fetchall(self):
        rows = self.cursor.fetchall()
        return [self._wrap_row(r) for r in rows]
        
    def close(self):
        self.cursor.close()
        
    def __iter__(self):
        return self
        
    def __next__(self):
        row = self.cursor.fetchone()
        if row is None:
            raise StopIteration
        return self._wrap_row(row)

class MySQLConnectionWrapper:
    def __init__(self, conn):
        self.conn = conn
        
    def cursor(self):
        return MySQLCursorWrapper(self.conn.cursor())
        
    def commit(self):
        return self.conn.commit()
        
    def close(self):
        return self.conn.close()
        
    def rollback(self):
        return self.conn.rollback()

    def execute(self, query, params=None):
        cursor = self.cursor()
        cursor.execute(query, params)
        return cursor

def init_db():
    if settings.DATABASE_TYPE == "mysql":
        import pymysql
        # Connect to MySQL without database to ensure it exists
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            port=settings.MYSQL_PORT
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DB}")
        conn.commit()
        cursor.close()
        conn.close()

        # Connect to target database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Users Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL
            )
        ''')
        
        # Orders Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                order_id VARCHAR(255) PRIMARY KEY,
                customer_id VARCHAR(255),
                seller_id VARCHAR(255),
                delivery_partner_id VARCHAR(255),
                amount DOUBLE,
                fraud_probability DOUBLE,
                risk_score INT,
                risk_level VARCHAR(255),
                action VARCHAR(255),
                collusion_detected TINYINT(1),
                collusion_score DOUBLE,
                raw_payload TEXT,
                assessment_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Appeals Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS appeals (
                appeal_id VARCHAR(255) PRIMARY KEY,
                entity_id VARCHAR(255),
                entity_type VARCHAR(255),
                reason TEXT,
                status VARCHAR(255),
                evidence_json TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_by VARCHAR(255),
                ai_confidence_score DOUBLE,
                decision_notes TEXT
            )
        ''')
        
        # Audit Logs Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                block_index INT AUTO_INCREMENT PRIMARY KEY,
                timestamp VARCHAR(255),
                order_id VARCHAR(255),
                action VARCHAR(255),
                risk_score INT,
                reviewer_id VARCHAR(255),
                model_version VARCHAR(255),
                payload_hash VARCHAR(255),
                previous_hash VARCHAR(255),
                block_hash VARCHAR(255)
            )
        ''')
        
        conn.commit()
        conn.close()
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Users Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL
            )
        ''')
        
        # Orders & Risk Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                order_id TEXT PRIMARY KEY,
                customer_id TEXT,
                seller_id TEXT,
                delivery_partner_id TEXT,
                amount REAL,
                fraud_probability REAL,
                risk_score INTEGER,
                risk_level TEXT,
                action TEXT,
                collusion_detected BOOLEAN,
                collusion_score REAL,
                raw_payload TEXT,
                assessment_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Appeals Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS appeals (
                appeal_id TEXT PRIMARY KEY,
                entity_id TEXT,
                entity_type TEXT,
                reason TEXT,
                status TEXT,
                evidence_json TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_by TEXT,
                ai_confidence_score REAL,
                decision_notes TEXT
            )
        ''')
        
        # Audit Chain Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                block_index INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                order_id TEXT,
                action TEXT,
                risk_score INTEGER,
                reviewer_id TEXT,
                model_version TEXT,
                payload_hash TEXT,
                previous_hash TEXT,
                block_hash TEXT
            )
        ''')
        
        conn.commit()
        conn.close()

def get_db_connection():
    if settings.DATABASE_TYPE == "mysql":
        import pymysql
        conn = pymysql.connect(
            host=settings.MYSQL_HOST,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            database=settings.MYSQL_DB,
            port=settings.MYSQL_PORT
        )
        return MySQLConnectionWrapper(conn)
    else:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn
