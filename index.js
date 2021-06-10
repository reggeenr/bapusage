const axios = require('axios').default;
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const get = (username, password, service, call, objectFilter, objectMask, resultLimit) => {
  const url = `https://api.softlayer.com/rest/v3.1/SoftLayer_${service}/${call}.json`;
  console.log(url);
  const params = {};

  if (objectFilter) {
    params.objectFilter = objectFilter;
  }
  if (objectMask) {
    params.objectMask = objectMask;
  }
  if (resultLimit) {
    params.resultLimit = resultLimit;
  }

  return axios.get(url, {
    auth: {
      username,
      password
    },
    params
  });
}
app.use(express.urlencoded());
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/post', async (req, res) => {
  const username = req.body.username;
  const apikey = req.body.apikey;
  try {
    const brands = await get(username, apikey, 'Account','getOwnedBrands');
    const result = [];
    for (brand of brands.data) {
      const objectMask = `mask[id,companyName,nextInvoiceTopLevelBillingItems]`;
      const accounts = await get(username, apikey, `Brand/${brand.id}`,'getOwnedAccounts','',objectMask);
      result.push(accounts.data);
    }
    res.json(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
