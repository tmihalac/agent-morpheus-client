import { ClientRequestError } from "./ClientUtils";

export const listProducts = async () => {
  const response = await fetch('/api/v1/reports/product', {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new ClientRequestError(response.status, response.statusText);
  }
  return await response.json();

};
export const deleteProductReports = async (filter) => {
  let url = '/api/v1/reports/product';
  if(filter.size > 0) {
    url += '?' + filter.toString();
  }
  const response = await fetch(url, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new ClientRequestError(response.status, response.statusText);
  }
  return true;
};

export const deleteProductReport = async (productId) => {
  const response = await fetch(`/api/v1/reports/product/${productId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new ClientRequestError(response.status, response.statusText);
  }
  return true;
};

export const getProduct = async (productId) => {
  const response = await fetch(`/api/v1/reports/product/${productId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new ClientRequestError(response.status, response.statusText);
  }
  return await response.json();

};