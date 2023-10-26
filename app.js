const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Configuração para armazenar os arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/' + req.body.folderName; // Use o nome da pasta fornecido no corpo da solicitação
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define a pasta de arquivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.array('files'), (req, res) => {
  res.send('Arquivos enviados com sucesso');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

