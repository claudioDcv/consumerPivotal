# Pivotal Report

## Requirements

- yarn v0.21.3
- node foreman v2.0.0 `npm install -g foreman

## Installation


- Clone repository
```sh
git clone <url-this-project>
```
- Install dependencies
```sh
yarn install
```
- Create .env files and added your Pivotal TOKEN
```sh
cp .env.example .env
```
- Run application with Node Foreman
```sh
nf start
```
## Usage

```sh
curl http://localhost:8899/?project_id={PROJECT_ID}&label={LABEL}
```
