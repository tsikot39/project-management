from typing import Dict, List
from fastapi import WebSocket
import json
import asyncio

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, organization_id: str):
        await websocket.accept()
        if organization_id not in self.active_connections:
            self.active_connections[organization_id] = []
        self.active_connections[organization_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, organization_id: str):
        if organization_id in self.active_connections:
            self.active_connections[organization_id].remove(websocket)
            if not self.active_connections[organization_id]:
                del self.active_connections[organization_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            pass  # Connection closed
    
    async def broadcast_to_organization(self, message: dict, organization_id: str):
        if organization_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[organization_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    disconnected.append(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                self.active_connections[organization_id].remove(conn)

websocket_manager = WebSocketManager()
