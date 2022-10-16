import pandas as pd
from sqlalchemy import create_engine
import sys

# Arguments: source CSV, output DB File
print(sys.argv)
engine = create_engine('sqlite:///{}'.format(sys.argv[1]))

print("Reading: {}".format(sys.argv[2]))
df = pd.read_csv(sys.argv[2])
print(df.columns)
df['time'] = pd.to_datetime(df['time'])
df.to_sql('data', con=engine)

