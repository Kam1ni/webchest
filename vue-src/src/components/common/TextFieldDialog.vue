<template>
	<v-dialog v-model="value" persistent max-width="500px">
		<v-card>
			<v-form v-model="valid" @submit="submit()">
				<v-card-title>
					<span class="headline">{{title}}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout wrap>
							<v-flex xs12>
								<v-text-field v-model="textValue" :label="label" required></v-text-field>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-btn flat @click.stop="submit()">Submit</v-btn>
					<v-btn flat @click.stop="cancel()">Cancel</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		data(){
			return {
				textValue: "",
				valid: false
			}
		},
		methods:{
			submit(){
				if (!this.valid || this.textValue == "")
					return;
				this.$emit("input", false);
				this.$emit("submit", this.textValue);
				this.textValue = "";
			},
			cancel(){
				this.$emit("input", false);
				this.textValue = "";
			}
		},
		props:['value', 'title', 'label']
	}
</script>
