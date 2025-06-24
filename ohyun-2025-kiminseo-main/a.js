const axios = require('axios');

const BASE_URL = 'http://crud.tlol.me';

async function createResource(userId, resource, data) {
  return axios.post(`${BASE_URL}/${userId}/${resource}`, data);
}

async function getAllResources(userId, resource, params = {}) {
  return axios.get(`${BASE_URL}/${userId}/${resource}`, { params });
}

async function getResource(userId, resource, id) {
  return axios.get(`${BASE_URL}/${userId}/${resource}/${id}`);
}

async function updateResource(userId, resource, id, data) {
  return axios.put(`${BASE_URL}/${userId}/${resource}/${id}`, data);
}

async function deleteResource(userId, resource, id) {
  return axios.delete(`${BASE_URL}/${userId}/${resource}/${id}`);
}

module.exports = {
  createResource,
  getAllResources,
  getResource,
  updateResource,
  deleteResource,
};