import express, { Application, Request, Response } from "express"
import createError from 'http-errors'
import * as path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
// import xmlparser from 'express-xml-bodyparser'

import initAzureSqlServer from './db/index'

import indexRouter from './routes/index'
import signRouter from './routes/sign'

// Connect to DB
try {
  initAzureSqlServer()
  console.log('[DB] Connection Success.')
} catch(e) {
  console.log('[DB] Error: ' + e.message)
}

// Init Express
const app: Application = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(xmlparser())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Set CORS Headers
app.use(function(req: Request, res: Response, next: Function): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_APP_CORS_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', ['Authorization', 'Content-Type'])
  next()
})

app.use('/', indexRouter)
app.use('/sign', signRouter)

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: Function): void {
  next(createError(404))
})

// error handler
app.use(function(err: any, req: Request, res: Response, next: Function): void {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
