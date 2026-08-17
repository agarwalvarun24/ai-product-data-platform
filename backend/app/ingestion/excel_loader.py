import io

import pandas as pd


def load_excel(content: bytes) -> list[dict]:
    dataframe = pd.read_excel(
        io.BytesIO(content),
        dtype=str,
    )

    dataframe = dataframe.fillna("")

    return dataframe.to_dict(
        orient="records",
    )