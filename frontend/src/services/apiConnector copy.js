export const getApiData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: "Failed to fetch data from API", details: data.message };
    }
  } catch (error) {
    console.error("Error in fetching data from API:", error);
    return { error: "Failed to fetch data from API", details: error.message };
  }
};

export const postApiData = async (url, data,token) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "authorization":`Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (response.ok) {
      return resData;
    } else {
      return { error: "Failed to post data to API", details: resData.message };
    }
  } catch (error) {
    console.error("Error in posting data to API:", error);
    return { error: "Failed to post data to API", details: error.message };
  }
};

export const putApiData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (response.ok) {
      return resData;
    } else {
      return { error: "Failed to put data to API", details: resData.message };
    }
  } catch (error) {
    console.error("Error in putting data to API:", error);
    return { error: "Failed to put data to API", details: error.message };
  }
};

export const deleteApiData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    const resData = await response.json();
    if (response.ok) {
      return resData;
    } else {
      return { error: "Failed to delete data from API", details: resData.message };
    }
  } catch (error) {
    console.error("Error in deleting data from API:", error);
    return { error: "Failed to delete data from API", details: error.message };
  }
};

