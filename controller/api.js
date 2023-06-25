const axios = require('axios')

async function getRequest(url){
    try { 
        const response = await axios.get(url)
        return response.data
    } catch (err) {
        console.error('Api request error: ', err)
        throw err
    }
}

module.exports = getRequest