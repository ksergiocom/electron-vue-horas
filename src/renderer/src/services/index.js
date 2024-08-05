// API base URL
const URL = "https://api-example.com";
const TOKEN = ''


// SOLO CON HTTPS
const headers = new Headers({
	"Authorization": TOKEN, // <------ Cambiar aqui
  })

export const getTrabajadores = async () => {
	const res = await fetch(URL + "/api/trabajadores", {
	  headers,
	})
	return await res.json();
  }

export const getLastRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimo`,
	  {
		headers,
	  }
	)
	return await res.json();
  };

export const getLastsRegisters = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimos`,
	  {
		headers,
	  }
	)
	return await res.json();
  };

export const postStartRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/iniciar`,
	  {
		method: "POST",
		headers,
	  }
	);
	return await res.json();
  };


export const postFinishRegister = async (trabajadorId) => {
	const res = await fetch(
	  URL + `/api/registros/${trabajadorId}/ultimo/finalizar`,
	  {
		method: "POST",
		headers,
	  }
	);
	return await res.json();
  };