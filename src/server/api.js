import {Post, User} from './DB';
import crypto from "crypto";
import {sendMail} from "./utils/mail";

exports.api = (app) => {

  app.post('/getArticle', (req, res) => {
    Post.find({})
      .then(data => res.end(JSON.stringify(data)))
      .catch(err => console.log(err));
  });

  app.get('/getUser', (req, res) => {
    User.find({account: req.session.user}, {_id:0,account:1,email:1,name:1,avatar:1,RegistedDate:1,mobile:1,address:1,hobby:1,birthday:1})
      .then(data => res.end(JSON.stringify(data[0])))
      .catch(err => console.log(err));
  });

  app.get('/checkLogin', (req, res) => {
    if (typeof req.session.user === 'string') {
      res.json({login: true});
    }
  });

  app.get('/userArticles/:user', (req, res) => {
    console.log(req.params.user);
    Post
      .find({posterAccount: req.params.user})
      .then(data => {
        res.end(JSON.stringify(data));
      });
  });

  app.post('*', (req, res, next) => {
    if (req.connection.remoteAddress !== '127.0.0.1') {
      res.end('not local');
    }
    next();
  });

  app.post('/login', (req, res) => {
    User.find({account: req.body.account})
      .then(data => {
        if (data[0] === undefined) {
          res.end('帳號或密碼錯誤');
        }
        if (data[0].password === req.body.password) {
          res.cookie('ifUser', true, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false});
          req.session.user = req.body.account;
          res.end('success login');
        } else {
          res.end('帳號密碼錯誤');
        }
      });
  });

  app.post('/logout', (req, res) => {
    res.cookie('ifUser', true, {expires: new Date()});
    req.session.user = null;
    res.end();
  });

  app.post('/signup', (req, res) => {

    User.find({account: req.body.account})
      .then(data => {
        if (data[0] != undefined) {
          res.end('此帳號已被註冊');
          throw new Error('此帳號已被停用');
        }
      })
      .then(() => {
        User.find({email: req.body.email})
          .then(data => {
            if (data[0] !== undefined) {
              res.end('此信箱已被使用');
              throw new Error('信箱重複'); // 以此方法來中斷then，記得寫catch
            }
          })
          .then(() => {
            const md5 = crypto.createHash('md5');
            let user = new User({
              account: req.body.account,
              password: req.body.password,
              email: req.body.email,
              name: req.body.nickName,
              avatar: `http://www.gravatar.com/avatar/${md5.update(req.body.email).digest('hex')}`,
              RegistedDate: new Date(),
              mobile: '',
              address: '',
              hobby: '',
              birthday: ''
            });
            user.save().catch(err => console.log(err));

            sendMail({email: req.body.email});
            res.end('成功註冊');
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });

  app.post('/postArticle', (req, res) => {
    if (typeof req.session.user === 'string') {
      let post = new Post({
        posterAccount: req.body.account,
        posterName: req.body.name,
        title: req.body.title,
        content: req.body.content,
        avatar: req.body.avatar,
        PostDate: new Date()
      });
      post.save()
        .then(() => {
          res.end('發表文章成功');
        })
        .catch(err => {
          res.end('發表文章錯誤');
        });
    }
  });

  app.put('/UpdateUserInfo', (req, res) => {
    User.update({account: req.body.account}, {
      avatar: req.body.avatar,
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
      hobby: req.body.hobby,
      birthday: req.body.birthday,
    })
      .then(() => (
        res.end('更改成功')
      ))
      .catch(err => {
        res.end('更改錯誤');
      });
  });

  app.put('/updateArticle', (req, res) => {
    console.log(req.body.content);
    Post
      .update({_id: req.body.id}, {$set: {'content': req.body.content}})
      .then(data => res.end(JSON.stringify(data)));
  });

};