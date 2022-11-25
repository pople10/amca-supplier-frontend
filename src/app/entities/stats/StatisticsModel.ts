export class StatsticsModel
{
    public users:UsersStats=new UsersStats();
    public years:YearsStats=new YearsStats();
    public categories:CategoriesStats=new CategoriesStats();
}

class UsersStats
{
    public buyerNumber:number;
    public otherUserNumber:number;
    public supplierNumber:number;
}
class CategoriesStats
{
    public buyers:CatStats[]=[];
    public suppliers:CatStats[]=[];
    public active:CatStats[]=[];
}
class YearsStats
{
    public buyers:YearStats[]=[];
    public suppliers:YearStats[]=[];
    public users:YearStats[]=[];
}
class YearStats
{
    public month:number;
    public count:number;
}
class CatStats
{
    public label:string;
    public count:number;
}