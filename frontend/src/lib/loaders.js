

export async function fetchPost(post){
    let answer = await fetch(`http://localhost:8080/post?page=${post}`);
    let temp = await answer.json()
    return temp.posts
}

export async function fetchusers(){
    let answer = await fetch(`http://localhost:8080/user`);
    let temp = await answer.json()
    return temp.users
}