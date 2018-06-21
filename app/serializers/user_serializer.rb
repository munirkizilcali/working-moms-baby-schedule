class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
  has_many :babies, through: :baby_users
  has_many :events, through: :babies
  has_many :care_takers, through: :babies
  has_many :baby_users
  has_many :children
end
