<script lang="ts" setup></script>

<template>
	<div class="container px-6 xl:px-0 mt-14 sm:mt-18 py-6">
		<DashboardAppTopbar class="mb-6" />
		<div class="flex flex-col gap-6 flex-1">
			<DashboardStatsComponent />
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<DashboardSalesTrendComponent />
				<DashboardRecentActivityComponent />
			</div>
			<DashboardProductOverviewComponent />
		</div>
	</div>
</template>
