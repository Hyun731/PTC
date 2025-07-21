from fastapi import APIRouter
from pydantic import BaseModel

from DB.db import execute_sql

router = APIRouter(prefix='/team')

class TeamMemberAdd(BaseModel):
    team_id: int
    member_id: int
    role: str
    feature : str
class TeamMemberDelete(BaseModel):
    team_id: int
    member_id: int

class TeamSearch(BaseModel):
    team_name: str | None = None
    region: str | None = None
    level: str | None = None

class TeamInquiry(BaseModel):
    id: int

@router.post('/teams_inquiry')
def teams_inquiry(data: TeamInquiry):
    sql = "select * from teams where id = :id"
    result = execute_sql(sql, {"id": data.id})
    return result


@router.post("/team_search")
def team_search(detailed: TeamSearch):
    conditions = []
    params = {}

    if detailed.team_name:
        conditions.append("team_name LIKE :team_name")
        params["team_name"] = f"%{detailed.team_name}%"

    if detailed.region:
        conditions.append("region = :region")
        params["region"] = detailed.region

    if detailed.level:
        conditions.append("level = :level")
        params["level"] = detailed.level

    sql = "SELECT team_name, region, level FROM teams"
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)

    result = execute_sql(sql, params)
    return result


@router.get('/top_teams')
def get_top_teams():
    sql = "select id, team_name, region, level from teams limit 6"
    return execute_sql(sql)

@router.post("/add_member")
def add_member(team: TeamMemberAdd):
    check_sql = "SELECT id FROM team_members WHERE id = :member_id"
    exists = execute_sql(check_sql, {"member_id": team.member_id})

    if not exists:
        sql = "INSERT INTO team_members (team_id, id, role, feature) VALUES (:team_id, :id, :role, :feature)"
        execute_sql(sql, {
            "team_id": team.team_id,
            "id": team.member_id,
            "role": team.role,
            "feature": team.feature
        }, fetch=False)
    else:
        user_update = "UPDATE users SET team_id = :team_id WHERE id = :id"
        member_update = "UPDATE team_members SET team_id = :team_id WHERE id = :id"

        execute_sql(user_update, {
            "team_id": team.team_id,
            "id": team.member_id
        }, fetch=False)

        execute_sql(member_update, {
            "team_id": team.team_id,
            "id": team.member_id
        }, fetch=False)

    return {"success": True}

@router.put('/update_member')
def update_member(team: TeamMemberAdd):
    sql = ("update team_members set feature = :feature, role = :role where team_id = :team_id AND id = :member_id")
    execute_sql(sql, {"team_id": team.team_id, "member_id": team.member_id, "role": team.role,"feature":team.feature}, fetch=False)
    return {"success": True}

@router.delete('/delete_member')
def delete_member(team: TeamMemberDelete):
    sql = ("delete from team_members where team_id = :team_id and id = :member_id")
    execute_sql(sql, {"team_id": team.team_id, "member_id": team.member_id},fetch=False)
    return {"success": True}

@router.get('/member_list')
def member_list():
    sql = "select * from team_members as t join users as u on t.id = u.id and t.team_id = u.team_id"
    result = execute_sql(sql)
    return result