import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'

export async function getRequest(url = "", Cookie = "") {

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            Cookie: Cookie
        }
    });
    console.log(response)
    let responseJson = await response.json();
    return responseJson;
}


export async function postRequest(url = "", Cookie = "", body = {}, headers = {}) {
    // const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Cookie: Cookie,
            ...headers
        },
        body: body
    })
    // let responseJson = await response.json();
    return response;
}


export async function putRequest(url = "", Cookie = "", body = {}, headers = {}) {
    let response = await fetch(url, {
        method: 'PUT',
        body: body,
        headers: {
            Cookie: Cookie,
            ...headers
        },

    });
    let responseJson = await response.json();
    return responseJson;
}
export async function deleteRequest(url = "", Cookie = "", body = {}, headers = {}) {
    let response = await fetch(url, {
        method: 'DELETE',
        body: body,
        headers: {
            Cookie: Cookie,
            ...headers
        },

    });
    let responseJson = await response.json();
    return responseJson;
}


