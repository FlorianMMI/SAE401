

export async function fetchPost(post) {
    
    let token = localStorage.getItem('token');
    let answer = await fetch(import.meta.env.VITE_URL + `/post?page=${post}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    let temp = await answer.json();
    return temp.posts;
}

export async function fetchBlocked(){
    let token = localStorage.getItem('token')
    let answer = await fetch(import.meta.env.VITE_URL + `/blocked`, {
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    });
    let temp = await answer.json()
    return temp
}



export async function fetchuser(id){
    let answer = await fetch(import.meta.env.VITE_URL + `/user/${id}`);
    let temp = await answer.json()
    
    return temp
}

export async function fetchPostId(id){
    let answer = await fetch(import.meta.env.VITE_URL + `/post/${id}`);
    let temp = await answer.json()
    return temp
}