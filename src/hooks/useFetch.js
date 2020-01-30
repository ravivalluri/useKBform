import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

export default function useFetch(url, reqType) {
  const [state, setState] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(url);
      setState({ res: data });
      // console.log(data);
    })();
  }, [url]);

  return [state, setState];
}
