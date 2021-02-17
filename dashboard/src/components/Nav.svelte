<script lang="ts">
	export let segment: string;
</script>

<nav>
	<ul class="flex">
		<li class="m-3"><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a></li>
		<li class="m-3"><a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">about</a></li>
	</ul>
</nav>
