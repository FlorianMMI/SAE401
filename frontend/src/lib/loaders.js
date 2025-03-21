

export async function fetchPost(post){
    let answer = await fetch(`http://localhost:8080/post?page=${post}`);
    let temp = await answer.json()
    return temp.posts
}

