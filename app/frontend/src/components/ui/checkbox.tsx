import { Checkbox as ChakraCheckbox } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  rootRef?: React.Ref<HTMLLabelElement>
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { children, inputProps, rootRef} = props
    return (
      <ChakraCheckbox.Root ref={rootRef} >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control>
            <ChakraCheckbox.Indicator></ChakraCheckbox.Indicator>
        </ChakraCheckbox.Control>
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
      </ChakraCheckbox.Root>
    )
  },
)
