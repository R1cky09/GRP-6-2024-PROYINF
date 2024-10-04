import json
import unittest
import requests
from pymongo import MongoClient

class TestRegisterEndpoint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Conectar a MongoDB
        cls.client = MongoClient('mongodb://localhost:27017/')
        cls.db = cls.client['DICOM']  
        cls.collection = cls.db['users'] 
        cls.base_url = "http://localhost:3001/api/users/register"
        
        cls.collection.insert_one({"username": "existente", "email": "existente@example.com", "password": "existente"})

    def test_registro_correcto(self):
        user_data = {"username": "new_user", "email": "new_user@example.com", "password": "new_password"}
        response = requests.post(self.base_url, json=user_data)
        print(response.json())
        print(f"Código de estado esperado: 201, Código de estado obtenido: {response.status_code}")
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())

    def test_registro_email_existente(self):
        user_data = {"username": "existente", "email": "existente@example.com", "password": "existente"}
        response = requests.post(self.base_url, json=user_data)
        print(response.json())
        print(f"Código de estado esperado: 400, Código de estado obtenido: {response.status_code}")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    @classmethod
    def tearDownClass(cls):
        # Limpiar datos insertados durante las pruebas
        cls.collection.delete_many({"email": {"$regex": "@example.com"}})
        cls.client.close()  # Cerrar la conexión con MongoDB

if __name__ == '__main__':
    unittest.main()
