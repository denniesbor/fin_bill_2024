# %%
import pandas as pd
import numpy as np
import geopandas as gpd
import json
import re
from pathlib import Path
import requests

# Load the shaopefile
gdf = gpd.read_file("data/ke_shp/regions_2_KEN.shp")

# Rename the column NAME_1 to county and NAME_2 to constituency
gdf.rename(columns={"NAME_1": "county", "NAME_2": "constituency"}, inplace=True)

# Extract the columns that are only needed: GID_1, county, county, and geometry
gdf = gdf[["GID_1", "county", "constituency", "geometry"]]

# Print the first 5 rows
gdf.head()
# %%
# Read a json which is a list of dictionaries
file_path = Path("../user-interface/src/data/updated_members.json")

# Read the JSON file
with file_path.open("r") as f:
    mps = json.load(f)

# Convert the list of dictionaries to a Pandas DataFrame
df_mps = pd.DataFrame(mps)
# %%
# Downlaod and save imagery
data_dir = Path("data")
image_dir = data_dir / "images"

# Create the directory if it doesn't exist
image_dir.mkdir(parents=True, exist_ok=True)


def clean_filename(s):
    # Replace spaces, periods, and commas with underscores
    s = re.sub(r"[ \.,]+", "_", s)
    # Remove any other characters that are not alphanumeric or underscores
    s = re.sub(r"[^\w_]", "", s)
    return s


# Iterate through the DataFrame and download images
for index, row in df_mps.iterrows():
    image_url = row["image"]
    constituency = clean_filename(row["constituency"])
    county = clean_filename(row["county"])
    name = clean_filename(row["name"])

    # Construct the filename
    filename = f"{constituency}_{county}_{name}.jpg"
    file_path = image_dir / filename

    # Download and save the image
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Check if the request was successful

        with open(file_path, "wb") as file:
            file.write(response.content)
        print(f"Downloaded {filename}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {image_url}: {e}")

# Print confirmation
print("Image download process completed.")

# %%
# Normalize the data
df_mps["county"] = df_mps["county"].str.strip().str.upper()
df_mps["constituency"] = df_mps["constituency"].str.strip().str.upper()

gdf["county"] = gdf["county"].str.strip().str.upper()
gdf["constituency"] = gdf["constituency"].str.strip().str.upper()

# Print the first 5 rows to verify normalization
print(df_mps.head())
print(gdf.head())

# %%s
# Perform an inner merge based on county and constituency
merged_df = pd.merge(gdf, df_mps, on=["county", "constituency"], how="inner")

# Print the first 5 rows to verify the merge
print(merged_df.head())

# %%
# Geojson from the merged_df and save it to a file
gdf = gpd.GeoDataFrame(merged_df, geometry="geometry")
gdf.to_file("data/merged_mps.geojson", driver="GeoJSON")
# %%
