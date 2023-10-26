const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(fileUpload());

// Define a pasta de arquivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  // Pasta de destino para o upload
  const uploadPath = path.join(__dirname, 'uploads', req.body.folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Processar os arquivos enviados
  for (let file of Object.values(req.files.files)) {
    const fileName = file.name;
    const filePath = path.join(uploadPath, fileName);

    file.mv(filePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
  }

  res.send('Arquivos enviados com sucesso');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
