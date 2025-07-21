from fastapi import APIRouter
from pydantic import BaseModel

from DB.db import execute_sql

router = APIRouter(prefix='/user')


class SignupUser(BaseModel):
    id: str
    password: str
    username: str
    profile_image: str
    position:str
    age: int
    active_region : str
    user_introduce:str

class LoginUser(BaseModel):
    id: str
    password: str

class UserInquiry(BaseModel):
    id: int




@router.post('/signup')
def signup(user: SignupUser):
    sql = (
        "INSERT INTO users(username, user_id, password, profile_image, position, age, active_region, user_introduce) "
        "VALUES (:username, :id, :password, :profile_image, :position, :age, :active_region, :user_introduce)"
    )
    execute_sql(sql, user.model_dump(), fetch=False)
    return "회원가입에 성공하였습니다"

@router.post('/login')
def login(user: LoginUser):
    sql = ("select user_id, password from users where user_id = :id")
    result = execute_sql(sql, {"id": user.id})
    print(result)
    if result[0].password == user.password:
        return {"status":"success"}
    else:
        return "failed"


@router.post('/users_inquiry')
def users_inquiry(data: UserInquiry):
    sql = ("select * from users where id = :id")
    result = execute_sql(sql, {"id": data.id})
    return result


