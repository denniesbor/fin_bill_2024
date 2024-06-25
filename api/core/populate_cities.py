import os
import sys
import django
import json
import requests
from django.contrib.gis.geos import Point

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myapi.settings')
django.setup()

# Import the City model after setting up Django
from core.models import City

# Replace with the URL of your JSON data
url = 'https://raw.githubusercontent.com/mowabanga/2022-2027_mps/main/donorpoints.json'

def fetch_and_populate_cities(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        cities_data = response.json()
        
        print(cities_data)

        for city_data in cities_data:
            city_name = list(city_data.keys())[0]
            city_info = city_data.get(city_name)
            lat, lon = map(float, city_info['gps'])
            point = Point(lon, lat)

            city, created = City.objects.get_or_create(
                name=city_name.capitalize(),
                defaults={'location': point}
            )

            if not created:
                city.location = point
                city.save()

            print(f"{'Created' if created else 'Updated'} city: {city_name}")

    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
    except Exception as e:
        print(f"Error processing data: {e}")

if __name__ == "__main__":
    fetch_and_populate_cities(url)
