# Scaffold

**Basic scaffolds for quick prototyping.**  
This repository provides ready-to-use starter setups for TypeScript projects.

---

## Available Scaffolds

### 1. TypeScript (CommonJS)
Basic TypeScript setup compiled to **CommonJS** modules.  
**Branch:** `typescript`  

### 2. TS Module (ES Modules)
TypeScript setup compiled to **ES Modules**.  
**Branch:** `ts-module`  

### 3. React
TypeScript + React starter for frontend prototyping.  
**Branch:** `react`  

---

## Quick Usage (Detached from Repo)

### Option 1: Download ZIP from GitHub
1. Go to the branch you want on GitHub.  
2. Click **Code → Download ZIP**.  
3. Extract it anywhere. You now have a standalone project.

### Option 2: Detached CLI Copy
```bash
git clone --branch <branch-name> --single-branch https://github.com/SingleDraw/scaffold.git temp && shopt -s dotglob && mv temp/* . && cd . && rm -rf temp
```
