

export async function fetchPost(post){
    let answer = await fetch('http://localhost:8080/posts?page=1');
    let temp = await answer.json()
    return temp.posts
}

