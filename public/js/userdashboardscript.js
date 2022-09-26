const getDetails = async () => {
    try {
        const url = `http://localhost:3000/user/details`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

window.onload = getDetails();