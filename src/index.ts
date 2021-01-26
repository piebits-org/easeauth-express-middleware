import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: any
    }
  }
}

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.headers.authorization
  const pc_app = req.headers['x-pc-app']

  if (access_token) {
    if (pc_app) {
      axios.get(
        'https://easeauth.cloud.piebits.org/actions/fetch/user',
        {
          headers: {
            'Authorization': access_token,
            'x-pc-app': pc_app
          }
        }
      ).then(({ data }) => {
        const user = {
          id: data._id,
          provider: data.provider,
          status: data.status,
          ...data.data
        }
        req.user = user
        next()
      }).catch(({ response }) => {
        res.status(response.data.status_code).send(response.data)
      })
    } else {
      res.status(401).send('[x-pc-app] header missing from request')
    }
  } else {
    res.status(401).send('[authorization] header missing from request')
  }
}

export default middleware