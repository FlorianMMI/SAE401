

export async function fetchPost(post){
    let answer = await fetch(`http://localhost:8080/post?page=${post}`);
    let temp = await answer.json()
    return temp.posts
}

export async function fetchuser(id){
    let answer = await fetch(`http://localhost:8080/user/${id}`);
    let temp = await answer.json()
    return temp.users
}