# %%
import pandas as pd
import numpy as np
import geopandas as gpd
import json
from pathlib import Path

# Load the shaopefile
gdf = gpd.read_file("data/regions_2_KEN.shp")

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
