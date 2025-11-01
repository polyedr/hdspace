#!/usr/bin/env python3
"""
Генератор SECRET_KEY для Django
Использование: python generate_secret_key.py
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("Сгенерированный SECRET_KEY:")
    print(secret_key)
    print("\nДобавьте эту строку в ваш .env файл:")
    print(f"SECRET_KEY={secret_key}")

