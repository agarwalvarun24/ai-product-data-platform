import io

import pandas as pd


def load_csv(content: bytes) -> list[dict]:
    dataframe = pd.read_csv(
        io.BytesIO(content),
        dtype=str,
    )

    dataframe = dataframe.fillna("")

    return dataframe.to_dict(
        orient="records",
    )