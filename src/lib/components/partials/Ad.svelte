<section class="Ad region">
    <img src="/images/ad.jpg" alt=''/>
    <img src="/images/ad.jpg" alt=''/>
</section>

<style>
.Ad{
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 15px;
    padding-top: 0;
}
.Ad img{
    width: 100%;
}

@media only screen and (max-width:600px){
    .Ad{
        grid-template-columns: 100%;
        padding: 10px 10px 0;
    }
}
</style>