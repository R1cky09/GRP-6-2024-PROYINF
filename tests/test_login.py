import unittest
import requests
import json
from pymongo import MongoClient

class TestLoginEndpoint(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Conectar a MongoDB
        cls.client = MongoClient('mongodb://localhost:27017/')
        cls.db = cls.client['DICOM']  
        cls.collection = cls.db['users']  
        cls.base_url = "http://localhost:3001/api/users/login"
        cls.collection.insert_one({"username": "test", "email": "test@example.com", "password": "test"})
        

    def test_login_correcto(self):
        user_data = {"username": "test", "password": "test"}
        response = requests.post(self.base_url, json=user_data)
        print(response.json())
        print(f"Código de estado esperado: 200, Código de estado obtenido: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())

    def test_login_incorrecto(self):
        user_data = {"username": "user", "password": "noeslacontraseña"}
        response = requests.post(self.base_url, json=user_data)
        print(response.json())
        print(f"Código de estado esperado: 401, Código de estado obtenido: {response.status_code}")
        self.assertEqual(response.status_code, 401)
        self.assertIn("message", response.json())

    @classmethod
    def tearDownClass(cls):
        # Limpiar datos insertados durante las pruebas
        cls.collection.delete_many({"username": {"$regex": "test"}})
        cls.client.close()  # Cerrar la conexión con MongoDB

if __name__ == '__main__':
    unittest.main()
