// @ts-nocheck
import { defineComponent } from "vue";

export default defineComponent({
	setup() {
		return () => (
			<div>
				<button style={{ border: "1px solid black", padding: "10px" }}>
					React component
				</button>
			</div>
		);
	}
});
