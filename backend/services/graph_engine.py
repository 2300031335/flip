import networkx as nx
from typing import Dict, Any, List, Tuple
from models.schemas import GraphData, GraphNode, GraphEdge, NodeCategory

class MultiActorGraphAI:
    """
    Graph AI Engine for Multi-Actor Fraud & Collusion Ring Detection.
    Uses NetworkX to build full e-commerce ecosystem topological graph,
    detecting communities, dense clusters, collusion cycles, and shared credentials.
    """
    def __init__(self):
        self.graph = nx.Graph()
        self._build_seed_graph()

    def _build_seed_graph(self):
        self.graph.clear()
        
        # Add Seed Nodes
        # 1. Collusion Ring Nodes (Red Flag Cluster)
        self._add_node("CUST-109", "Alice Vance", NodeCategory.CUSTOMER, risk_score=85, is_suspicious=True)
        self._add_node("CUST-305", "Bob Smith (Fake)", NodeCategory.CUSTOMER, risk_score=78, is_suspicious=True)
        self._add_node("SELL-881", "Apex Digital Store", NodeCategory.SELLER, risk_score=94, is_suspicious=True)
        self._add_node("DELIV-302", "QuickExpress Rider 12", NodeCategory.DELIVERY_PARTNER, risk_score=88, is_suspicious=True)
        self._add_node("DEV-RING-01", "iPhone 15 Pro (Shared)", NodeCategory.DEVICE, risk_score=92, is_suspicious=True)
        self._add_node("IP-198.51.100.44", "198.51.100.44 (Proxy IP)", NodeCategory.IP_ADDRESS, risk_score=90, is_suspicious=True)
        self._add_node("ADDR-RING-404", "404 Phantom Loop", NodeCategory.ADDRESS, risk_score=89, is_suspicious=True)
        self._add_node("BANK-HASH-992", "Chase Account *992", NodeCategory.BANK_ACCOUNT, risk_score=95, is_suspicious=True)
        
        # 2. Legitimate Network Nodes (Green Cluster)
        self._add_node("CUST-204", "David Miller", NodeCategory.CUSTOMER, risk_score=10, is_suspicious=False)
        self._add_node("SELL-442", "Green Earth Books", NodeCategory.SELLER, risk_score=8, is_suspicious=False)
        self._add_node("DELIV-110", "FedEx Express #10", NodeCategory.DELIVERY_PARTNER, risk_score=5, is_suspicious=False)
        self._add_node("DEV-LEGIT-99", "MacBook Pro M2", NodeCategory.DEVICE, risk_score=5, is_suspicious=False)
        self._add_node("IP-203.0.113.12", "203.0.113.12 (Home IP)", NodeCategory.IP_ADDRESS, risk_score=2, is_suspicious=False)
        self._add_node("ADDR-LEGIT-123", "123 Main St, Seattle", NodeCategory.ADDRESS, risk_score=3, is_suspicious=False)

        # Add Edges (Collusion Ring 1)
        self._add_edge("CUST-109", "DEV-RING-01", "SHARED_DEVICE", weight=3.0)
        self._add_edge("SELL-881", "DEV-RING-01", "SHARED_DEVICE", weight=3.0)
        self._add_edge("DELIV-302", "DEV-RING-01", "SHARED_DEVICE", weight=2.5)
        self._add_edge("CUST-305", "DEV-RING-01", "SHARED_DEVICE", weight=2.0)
        
        self._add_edge("CUST-109", "IP-198.51.100.44", "SHARED_IP", weight=2.0)
        self._add_edge("SELL-881", "IP-198.51.100.44", "SHARED_IP", weight=2.0)
        
        self._add_edge("CUST-109", "ADDR-RING-404", "SHARED_ADDRESS", weight=2.0)
        self._add_edge("SELL-881", "ADDR-RING-404", "SHARED_ADDRESS", weight=2.0)
        
        self._add_edge("SELL-881", "BANK-HASH-992", "PAYMENT", weight=3.0)
        self._add_edge("CUST-109", "BANK-HASH-992", "REFUNDED_TO", weight=3.0)
        self._add_edge("CUST-109", "SELL-881", "PLACED_ORDER", weight=1.5)
        self._add_edge("DELIV-302", "SELL-881", "DELIVERED_BY", weight=1.5)

        # Add Edges (Legitimate Network)
        self._add_edge("CUST-204", "DEV-LEGIT-99", "SHARED_DEVICE", weight=1.0)
        self._add_edge("CUST-204", "IP-203.0.113.12", "SHARED_IP", weight=1.0)
        self._add_edge("CUST-204", "ADDR-LEGIT-123", "SHARED_ADDRESS", weight=1.0)
        self._add_edge("CUST-204", "SELL-442", "PLACED_ORDER", weight=1.0)
        self._add_edge("DELIV-110", "SELL-442", "DELIVERED_BY", weight=1.0)

    def _add_node(self, node_id: str, label: str, category: NodeCategory, risk_score: int = 0, is_suspicious: bool = False):
        self.graph.add_node(
            node_id,
            label=label,
            category=category.value,
            risk_score=risk_score,
            is_suspicious=is_suspicious
        )

    def _add_edge(self, u: str, v: str, relation: str, weight: float = 1.0):
        self.graph.add_edge(u, v, relation=relation, weight=weight)

    def ingest_order(self, payload: Dict[str, Any]) -> Tuple[bool, float, List[List[str]], List[str]]:
        """
        Ingests a new order into the Graph topology, runs Collusion Detection, 
        and identifies circular rings or shared asset overlaps.
        """
        cust_id = payload["customer_id"]
        sell_id = payload["seller_id"]
        deliv_id = payload["delivery_partner_id"]
        device_id = payload["device_id"]
        ip_addr = f"IP-{payload['ip_address']}"
        addr = f"ADDR-{payload['shipping_address']}"
        bank_hash = payload.get("bank_account_hash", "BANK-DEFAULT")

        # Dynamically attach nodes if missing
        self._add_node(cust_id, f"Customer ({cust_id})", NodeCategory.CUSTOMER)
        self._add_node(sell_id, f"Seller ({sell_id})", NodeCategory.SELLER)
        self._add_node(deliv_id, f"Delivery Partner ({deliv_id})", NodeCategory.DELIVERY_PARTNER)
        self._add_node(device_id, f"Device ({device_id})", NodeCategory.DEVICE)
        self._add_node(ip_addr, f"IP ({payload['ip_address']})", NodeCategory.IP_ADDRESS)
        self._add_node(addr, f"Address ({payload['shipping_address']})", NodeCategory.ADDRESS)
        self._add_node(bank_hash, f"Bank Hash ({bank_hash})", NodeCategory.BANK_ACCOUNT)

        # Connect Edges
        self._add_edge(cust_id, device_id, "SHARED_DEVICE", weight=2.0)
        self._add_edge(sell_id, device_id, "SHARED_DEVICE", weight=2.0)
        self._add_edge(deliv_id, device_id, "SHARED_DEVICE", weight=1.5)
        
        self._add_edge(cust_id, ip_addr, "SHARED_IP", weight=1.5)
        self._add_edge(sell_id, ip_addr, "SHARED_IP", weight=1.5)
        
        self._add_edge(cust_id, addr, "SHARED_ADDRESS", weight=1.5)
        self._add_edge(sell_id, addr, "SHARED_ADDRESS", weight=1.5)
        
        self._add_edge(cust_id, sell_id, "PLACED_ORDER", weight=1.0)
        self._add_edge(sell_id, bank_hash, "PAYMENT", weight=2.0)
        self._add_edge(cust_id, bank_hash, "REFUNDED_TO", weight=2.0)

        # Run Collusion Algorithms
        collusion_score, collusion_reasons = self.calculate_collusion_score(cust_id, sell_id, deliv_id, device_id)
        rings = self.detect_cycles_and_rings(cust_id)
        collusion_detected = collusion_score > 50.0 or len(rings) > 0

        return collusion_detected, collusion_score, rings, collusion_reasons

    def calculate_collusion_score(self, cust_id: str, sell_id: str, deliv_id: str, device_id: str) -> Tuple[float, List[str]]:
        score = 0.0
        reasons = []

        # 1. Check Shared Devices between Customer, Seller, Delivery Partner
        cust_neighbors = set(self.graph.neighbors(cust_id)) if cust_id in self.graph else set()
        sell_neighbors = set(self.graph.neighbors(sell_id)) if sell_id in self.graph else set()
        deliv_neighbors = set(self.graph.neighbors(deliv_id)) if deliv_id in self.graph else set()

        shared_devices = (cust_neighbors & sell_neighbors) | (cust_neighbors & deliv_neighbors)
        device_nodes = [n for n in shared_devices if self.graph.nodes[n].get("category") == NodeCategory.DEVICE.value]
        
        if device_nodes:
            score += 45.0
            reasons.append(f"Customer '{cust_id}' and Seller '{sell_id}' share hardware device '{device_nodes[0]}'.")

        # 2. Check Shared IP Subnet
        shared_ips = [n for n in (cust_neighbors & sell_neighbors) if self.graph.nodes[n].get("category") == NodeCategory.IP_ADDRESS.value]
        if shared_ips:
            score += 25.0
            reasons.append(f"Customer '{cust_id}' and Seller '{sell_id}' logged in from identical IP address '{shared_ips[0]}'.")

        # 3. Check Shared Physical Address
        shared_addrs = [n for n in (cust_neighbors & sell_neighbors) if self.graph.nodes[n].get("category") == NodeCategory.ADDRESS.value]
        if shared_addrs:
            score += 20.0
            reasons.append(f"Customer and Seller share exact physical dispatch address '{shared_addrs[0]}'.")

        # 4. Check Degree Centrality Anomaly (Hub Node)
        if device_id in self.graph and self.graph.degree(device_id) >= 4:
            score += 15.0
            reasons.append(f"Hardware device '{device_id}' acts as a high-degree hub linked to {self.graph.degree(device_id)} accounts.")

        return min(score, 100.0), reasons

    def detect_cycles_and_rings(self, start_node: str) -> List[List[str]]:
        """Finds simple cycles / circular refund rings containing start_node."""
        if start_node not in self.graph:
            return []
        
        try:
            cycles = list(nx.cycle_basis(self.graph))
            user_rings = [c for c in cycles if start_node in c and len(c) >= 3]
            return user_rings[:3]
        except Exception:
            return []

    def get_full_graph_data(self) -> GraphData:
        nodes_list = []
        for n, d in self.graph.nodes(data=True):
            nodes_list.append(GraphNode(
                id=n,
                label=d.get("label", n),
                category=NodeCategory(d.get("category", NodeCategory.CUSTOMER.value)),
                risk_score=d.get("risk_score", 0),
                is_suspicious=d.get("is_suspicious", False),
                details={"degree": self.graph.degree(n)}
            ))

        edges_list = []
        for u, v, d in self.graph.edges(data=True):
            edges_list.append(GraphEdge(
                source=u,
                target=v,
                relation=d.get("relation", "LINKED"),
                weight=d.get("weight", 1.0)
            ))

        # Detect overall graph collusion rings
        all_cycles = list(nx.cycle_basis(self.graph))
        collusion_rings = [c for c in all_cycles if len(c) >= 3]

        return GraphData(
            nodes=nodes_list,
            edges=edges_list,
            collusion_rings=collusion_rings,
            dense_clusters_count=len(collusion_rings)
        )

graph_engine = MultiActorGraphAI()
