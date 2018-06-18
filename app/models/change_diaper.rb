class ChangeDiaper < Event
	validates :amount_1, :amount_2, presence: true
end
