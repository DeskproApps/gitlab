import { FC, useState } from 'react'
import { get } from 'lodash'
import {
  faCheck,
  faCaretDown,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  Dropdown,
  LabelProps,
  DropdownTargetProps,
  DivAsInputWithDisplay,
  DivAsInputWithDisplayProps,
  AnyIcon,
} from '@deskpro/deskpro-ui'
import { Label } from '../Label'
import type { Option } from '../../../types'

type Props = {
  id: string
  label?: string
  error?: DivAsInputWithDisplayProps['error']
  value: Option
  options: Option[]
  onChange: (o: Option) => void
  placeholder?: DivAsInputWithDisplayProps['placeholder']
  showInternalSearch?: boolean
  required?: LabelProps['required']
}

const SingleSelect: FC<Props> = ({
  id,
  label,
  error,
  value,
  options,
  onChange,
  required,
  placeholder,
  showInternalSearch,
  ...props
}) => {
  const [input, setInput] = useState<string>('')

  return (
    <Dropdown
      showInternalSearch={showInternalSearch}
      fetchMoreText={'Fetch more'}
      autoscrollText={'Autoscroll'}
      selectedIcon={faCheck as AnyIcon}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      placement="bottom-start"
      hideIcons
      inputValue={input}
      onSelectOption={(selectedOption) => {
        setInput('')
        onChange(selectedOption)
      }}
      onInputChange={(value) => {
        if (showInternalSearch) {
          setInput(value)
        }
      }}
      options={options.filter((option: Option) => {
        return (get(option, ['label'], '') as string).includes(input)
      })}
      {...props}
    >
      {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => {
        return (
          <Label htmlFor={id} required={required} label={label}>
            <DivAsInputWithDisplay
              id={id}
              placeholder={placeholder || 'Select Value'}
              value={get(value, ['label'], '') || ''}
              variant="inline"
              rightIcon={faCaretDown}
              error={error}
              ref={targetRef}
              {...targetProps}
              isVisibleRightIcon={false}
            />
          </Label>
        )
      }}
    </Dropdown>
  )
}

export { SingleSelect }
