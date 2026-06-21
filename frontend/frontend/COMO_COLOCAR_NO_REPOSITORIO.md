# Como colocar o frontend no repositorio

Como sua pasta local estava com conflito de Git, o caminho mais seguro e usar uma copia limpa.

```powershell
cd "E:\1 - LILIANNE\Area de Trabalho\1-PUC\2026-1\TADS\trabalho final"

git clone https://github.com/RM-Classroom/tads-2026-1-tp1-lilianneps.git repo-frontend-final

Copy-Item -Recurse -Force "C:\Users\Lilianne\Documents\Codex\2026-06-20\github-plugin-github-openai-curated-remote\outputs\frontend" ".\repo-frontend-final\frontend"

cd ".\repo-frontend-final"

git status
git add frontend
git commit -m "Adiciona frontend integrado a API"
git push
```

Depois confira no GitHub se existe:

```text
frontend/index.html
frontend/styles.css
frontend/app.js
frontend/assets/logoAlugafacil.PNG
frontend/wireframes.html
frontend/README.md
frontend/roteiro-pitch.md
```

Para testar:

```powershell
dotnet run --project ".\Locadora\Locadora.csproj"
cd frontend
python -m http.server 5500
```

Acesse:

```text
http://localhost:5500
```
