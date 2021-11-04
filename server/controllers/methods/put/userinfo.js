const db = require('../../../models');
const { tokenCheck } = require('../../token')

module.exports = async (req, res) => {
  const { password } = req.body;
  const authorization = req.headers['authorization'];
  if(!authorization) {
    //인증 정보가 없으면
    res.status(400).json({message:"Token has expired Please log in again"});
  }else {
    //토큰만 거르기
    const token = authorization.split(' ')[1];
    //토큰 검증 함수
    const check = await tokenCheck(token);
    //엑세스토큰 & 리프레시토큰 유효하지 않으면
    if(!check) {
      res.status(400).json({message:"Token has expired Please log in again"});
    }else if(check.social) {
      res.json({ message: "소셜로그인은 회원정보 수정이 불가능합니다" })
    }else {
      //정보 수정
      await db.user.update({password: password}, {where: {
        email: check.email
      }})
      //응답
      res.status(200).json({
        data: {password: password},
        message: "It is changed"
      })
    }
  }
}