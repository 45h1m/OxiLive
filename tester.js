const host = 'localhost';

const devices = [{"deviceID":"HR1364JE8","email":null},{"deviceID":"HR64J1RE8","email":null},{"deviceID":"HR6754JE8","email":null},{"deviceID":"HR67565E8","email":null}];

setInterval(() => {

  devices.forEach(async device => {

    const rand = Math.floor(Math.random() * 101);
    const rand2 = Math.floor(Math.random() * 101);

    try {
      
      const res = await makeGET(`http://${host}/device/update/${device.deviceID}?oxygen=${rand}&bpm=${rand2}`);
      console.log(res);
      
    } catch (err) {
      
      console.log(err);
    }


  });
}, 3000);

function makeGET(url) {

  return new Promise(async (resolve, reject) => {

    try {
      
      const res = await fetch(url, {method: 'GET'});

      const data = res.text();

      resolve(data);

    } catch (err) {

      reject(err);
    }
  })
}