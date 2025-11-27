<script>
    import { page } from '$app/state'
    let { form } = $props()
</script>

<svelte:head>
    <link href="/fonts/setup.css" rel="stylesheet" />
    <link href="/styles/base-frontend.css" rel="stylesheet" />
    <title>{page.data.title}</title>
</svelte:head>

<section class='Login' >
    <div class='title'>ចុះ​ឈ្មោះ​ចូល​ផ្នែក​​គ្រប់គ្រង</div>
 
    <form method='post' >
        <span>Email:</span><input type='email' name='email' required />
        <span>ពាក្យ​សំងាត់ៈ</span><input type='password' name='password' required />
        <apan></apan><input type='submit' value='បញ្ជូន' />
        <span></span><div class='info'>{form?.message ?? ''}</div>
    </form>
</section>

<style>
.Login{
    width: 400px;
    margin: 100px auto;
    background: var(--background-dark);
} 
 
.Login .title{
    text-align: center;
    font: 18px/1.5 Koulen, Oswald;
    padding: 5px;
    border-bottom: 1px solid white;
    color: white;
}
 
.Login form{
    padding: 20px 20px;
    display: grid;
    grid-template-columns: 20% auto; 
    grid-gap: 5px;
    align-items: center;
}
 
.Login form span{
    text-align: right;
    color: white;
}
 
.Login form input{
    padding: 0 5px;
    font: var(--body-font);
}
 
.Login .info{
    text-align: center;
    color: white;
}
 
.Login form input[type=submit]{
    font: var(--body-font);
    padding-top: 0;
}
 
@media only screen and (max-width: 600px){
    .Login form{
        grid-template-columns: 100%; 
    }
 
    .Login form span{
        text-align: left;
    }
}
</style>