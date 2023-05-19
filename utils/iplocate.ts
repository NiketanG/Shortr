const API_ENDPOINT = "https://www.iplocate.io/api/lookup/";

function validateIP(ip: string) {
	if (
		/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
			ip
		)
	) {
		return true;
	} else if (
		/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(
			ip
		)
	) {
		return true;
	} else {
		return false;
	}
}

async function iplocate(ip_address: string) {
	return new Promise((resolve, reject) => {
		// Check that our IP address is valid
		if (!validateIP(ip_address)) {
			reject("Invalid IP address");
		}

		// Add our API key header, if we have one
		let headers = {};

		let endpoint = API_ENDPOINT + ip_address;

		return fetch(endpoint, {
			headers: {
				...headers,
				Accept: "application/json",
			},
		})
			.then(function (results) {
				resolve(results);
			})
			.catch(function (e) {
				// Return either the server-provided error, or the default error from request
				let error =
					e.response && e.response.body && e.response.body.error
						? e.response.body.error
						: e.message;
				reject(error);
			});
	});
}

export default iplocate;
