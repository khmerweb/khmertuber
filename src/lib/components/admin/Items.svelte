<script>
    let { data, form } = $props()
	let items = $state(data.items)
	import {activePage} from "$lib/stores/page.js"
    import { page } from '$app/stores'
	let value = $state(undefined)
	$effect(() => { $activePage = value })
	let navPage = data?.navPage || 1
	async function paginate(e){
		const response = await fetch(`/admin/${data.type}/paginate/${e.target.value}`)
		items = await response.json()
	}

	let message = $state('លុប​បាន​ដោយ​ជោគជ័យ')
	if(data.delObj?.type === 'post'){
		if(data.delObj.success === 'no'){
			message = 'អ្នក​​មិន​អាច​លុប​ការផ្សាយ​របស់​អ្នក​ដទៃ​បាន​ឡើយ'
		}
	}else if(data.delObj?.type === 'category'){
		if(data.delObj.success === 'no'){
			message = 'អ្នក​​គ្មាន​សិទ្ធ​លុប​ជំពូក​ឡើយ!'
		}
	}else if(data.delObj?.type === 'page'){
		if(data.delObj.success === 'no'){
			message = 'អ្នក​គ្មាន​សិទ្ធ​លុប​ទំព័រ​ស្តាទិក​​ទេ!'
		}
	}else if(data.delObj?.type === 'user'){
		if(data.delObj.success === 'no'){
			message = 'អ្នក​គ្មាន​សិទ្ធ​លុបអ្នក​និពន្ធ​ទេ​!'
		}
	}else if(data.delObj?.type === 'setting'){
		if(data.delObj.success === 'no'){
			message = 'អ្នក​គ្មាន​សិទ្ធ​លុប setting ទេ​!'
		}
	}
	

</script>

<footer>
	{#if form}
	<div class="{form.success ? 'success':'error'}">{ form.message }</div>
	{:else if data.delObj?.success}
	<div class="{data.delObj.success === 'yes' ? 'success':'error'}">{ message }</div>
	{/if}
    <div class="info">{data?.info}​ទាំងអស់​មានចំនួនៈ {data?.count}</div>
    <div class="items">
        {#each items as item}
        <div class="item">
            <a class="thumb" href="/{data.type}/{item._id}">
                <img src={item.thumb} alt='' />
                {#if item.videos?.length}
                <img class="play" src="/images/play.png" alt='' />
                {/if}
            </a>
            <div class="title">
                <a href="/{data.type}/{item._id}">{item.title}</a>
                <div>{new Date(item.date).toLocaleDateString('it-IT')}</div>
            </div>
            <div class="edit">
				<a href="/admin/{data.type}/delete/{item._id}">
					<img src="/images/delete.png" alt=''/>
				</a>
                <a style="padding-right:5px;" href={`/admin/${data.type}/edit/${item._id}?p=${value}`}>
					<img src="/images/edit.png" alt='' />
				</a>
            </div> 
        </div>
        {/each}
    </div>
	<div class="pagination">
		<span>​​​​​​​​​​​​​​​​​​​​​ទំព័រ </span>
			<select bind:value onchange={paginate}> 
				{#each [...Array(data.pageNumber).keys()] as page}
					{#if page+1 == parseInt(navPage)}
					<option selected>{page+1}</option>
					{:else}
					<option>{page+1}</option>
					{/if}
				{/each}
			</select> 
            
        <span>នៃ {data?.pageNumber}</span>
	</div>
</footer>

<style>
    footer{
		margin-top: 0;
	}
	footer .success, footer .error{
		background-color: green;
		text-align: center;
		margin-top: 10px;
		padding: 5px;
		color: white;
	}
	footer .error{
		background-color: red;
	}
	footer .info{
		background-color: var(--background);
		text-align: center;
		margin-top: 10px;
		padding: 5px;
	}
	footer .items{
		display: grid;
		grid-template-columns: calc(50% - 5px ) calc(50% - 5px );
		grid-gap: 10px;
		margin-top: 10px;
	}
	footer .items .item{
		background-color: var(--background);
		display: grid;
		grid-template-columns: 130px auto;
		grid-gap: 10px;
		align-items: center;
		padding-right: 10px;
	}
	footer .items .item:hover{
		grid-template-columns: 130px auto 75px;
	}
	footer .items .item .thumb{
		position: relative;
		padding-top: 56.25%;
		overflow: hidden;
	}
	footer .items .item .thumb img{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		float: left;
	}
	footer .items .item .thumb .play{
		width: 25%;
		top: 50%;
    	left: 50%;
		min-height: auto;
		transform: translate(-50%,-50%);
	}
	footer .items .item .title{
		white-space: nowrap;
        overflow: hidden;
    	text-overflow: ellipsis;
		
	}
	footer .items .item .edit{
    	text-align: right;
		display: none;
	}
	footer .items .item .edit a{
    	float: right;
	}
	footer .items .item .edit img{
		width: 30px;
	}
	footer .items .item .edit img:hover{
		cursor: pointer;
		opacity: .7;
	}
	footer .items .item:hover .edit{
    	display: block;
		grid-template-columns: auto auto;
	}
	footer .pagination{
		text-align: center;
		margin-top: 20px;
	}

    @media only screen and (max-width: 600px){
        footer .items{
            grid-template-columns: 100%;
        }
        footer .items .item .edit img{
		    width: 35px;
	    }
    }
</style>