// API base URL
const URL = "https://api.example.com";

// Credentials for basic Auth
const CREDENTIALS = {
  username: "my_username",
  password: "my_password",
};

// Shared headers for basic Auth fetch. Use ONLY with HTTPS!
const headers = new Headers({
	Authorization: `Basic ${btoa(
	  `${CREDENTIALS.username}:${CREDENTIALS.password}`
	)}`,
  })

export const getTrabajadores = async () => {
	const res = await fetch(URL + "/api/trabajadores/", {
	  headers,
	})
	return await res.json();
  }

export const getLastRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimo/`,
	  {
		headers,
	  }
	)
	return await res.json();
  };

export const getLastsRegisters = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimos/`,
	  {
		headers,
	  }
	)
	return await res.json();
  };

export const postStartRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/iniciar/`,
	  {
		method: "POST",
		headers,
	  }
	);
	return await res.json();
  };


export const postFinishRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimo/finalizar/`,
	  {
		method: "POST",
		headers,
	  }
	);
	return await res.json();
  };