const axios = require('axios');
const fs = require('fs');

const URI = 'http://localhost:8080/api/v1/clients';
const clientsDataPath = `${__dirname}/data/clients.json`;

const addClient = (data) => axios.post(URI, data);
const deleteClient = (id) => axios.delete(`${URI}/${id}`);

const deleteClients = async () => {
	try {
		let clientIds = await axios
			.get(URI)
			.then((res) => res.data)
			.then((data) => data?.content.map(({id}) => id));

		let result = await Promise.allSettled(
			clientIds.map((id) => deleteClient(id))
		);

		let fufilled = result.filter((res) => res.status === 'fulfilled');
		// console.log(fufilled);

		console.log('success rate ', fufilled.length, '/', result.length);
	} catch (error) {
		console.log(error);
	}
};

const seedClients = async () => {
	try {
		let clientsData = JSON.parse(fs.readFileSync(clientsDataPath), 'utf-8');
		// console.log(clientsData);

		let result = await Promise.allSettled(
			clientsData.map((client) => addClient(client))
		);

		// console.log(result);

		let fufilled = result.filter((res) => res.status === 'fulfilled');

		console.log('success rate ', fufilled.length, '/', result.length);
	} catch (error) {
		console.log(error);
	}
};

// deleteClients();
// seedClients();

if (process.argv[2] === '-i') {
	seedClients();
} else if (process.argv[2] === '-d') {
	deleteClients();
}
