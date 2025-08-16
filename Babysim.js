const axios = require("axios");

const baseApiUrl = async () => {
  return "https://noobs-api.top/dipto";
};

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe", "sam"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better than all sim simi",
  category: "chat",
  guide: {
    en: `{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]`
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    if (args[0] === "rm" && dipto.includes("-")) {
      const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
      const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      if (args[1] === "all") {
        const data = (await axios.get(`${link}?list=all`)).data;
        const limit = parseInt(args[2]) || 100;
        const limited = data?.teacher?.teacherList?.slice(0, limit);
        const teachers = await Promise.all(
          limited.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const name = (await usersData.getName(number).catch(() => number)) || "Not found";
            return { name, value };
          })
        );
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join("\n");
        return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const d = (await axios.get(`${link}?list=all`)).data;
        return api.sendMessage(`❇️ | Total Teach = ${d?.teacher?.teacherList?.length || "api off"}\n♻️ | Total Response = ${d?.responseLength || "api off"}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === "msg") {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const commandSplit = dipto.split(/\s*-\s*/);
      if (!commandSplit[1] || commandSplit[1].length < 2) {
        return api.sendMessage("❌ | Invalid format! Use edit [YourMessage] - [NewReply]", event.threadID, event.messageID);
      }
      const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${commandSplit[1]}&senderID=${uid}`)).data.message;
      return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
    }

    if (args[0] === "teach" && args[1] !== "amar" && args[1] !== "react") {
      const [comd, command] = dipto.split(/\s*-\s*/);
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
      const tex = re.data.message;
      return api.sendMessage(`✅ Replies added ${tex}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === "teach" && args[1] === "amar") {
      const [comd, command] = dipto.split(/\s*-\s*/);
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(/\s*-\s*/);
      const final = comd.replace("teach react ", "");
      if (!command || command.length < 2) return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    if (dipto.includes("amar name ki") || dipto.includes("amr nam ki") || dipto.includes("amar nam ki") || dipto.includes("amr name ki") || dipto.includes("whats my name")) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }

    const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}`)).data.reply;
    api.sendMessage(d, event.threadID, event.messageID);

  } catch (e) {
    console.log(e);
    api.sendMessage("Check console for error", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event }) => {
  try {
    const text = event.body || event.messageReply?.body || event.messageReply?.text;
    if (!text) return;
    const apiUrl = await baseApiUrl();
    const response = (await axios.get(`${apiUrl}/baby?text=${encodeURIComponent(text.toLowerCase())}&senderID=${event.senderID}`)).data.reply;
    await api.sendMessage(response, event.threadID, event.messageID);
  } catch (err) {
    console.log(err);
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onChat = async ({ api, event }) => {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
      const arr = body.replace(/^\S+\s*/, "");
      const randomReplies = [
        "Ki koro? Amar din ektu bright hoye gelo tomar message e 😏",
        "Tumi keno eto mishti hoy? Mon ta pura melt hocche 🫠",
        "Ami ekdom ready… tumi bollei shuru 😎",
        "Tomar kotha shune amar mood off the chart hoye gelo 🔥",
        "Kemon lagche tomar din? Bujhte parchi tumi amar dike secretly smile korcho 😌",
        "Ami toh excited, tumi shuru koro jan 😜",
        "Tomar smile er magic e amar control khoye jachhe 😍",
        "Ekta question… ami ki tomar mind e bar bar ashi? 😉",
        "Tomar message ashlei pura smile automatic on hoye jai 😚",
        "Flirt korle ami pura har mane jai… r moja o pai 😇",
        "Oii, tomar kotha gulo pura priyo lagche 🔥",
        "Tumi samne thakle ami wink dite dite bolbo ‘miss korchi’ 😉",
        "Keno eto attractive? Amar toh mood totally spoil 😅",
        "Tomar text porlei mone hoy ekta romantic scene cholche 🎬❤️",
        "Ami soft, tumi flirt korle pura pani hoye jabo 🫠",
        "Kire kichu bolba naki offline jabo 😉",
        "Notun energy pailam, thanks tumi 😎"
      ];

      if (!arr) {
        const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        return api.sendMessage(reply, event.threadID, event.messageID);
      }

      const apiUrl = await baseApiUrl();
      const a = (await axios.get(`${apiUrl}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}`)).data.reply;
      await api.sendMessage(a, event.threadID, event.messageID);
    }
  } catch (err) {
    console.log(err);
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};